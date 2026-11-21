package com.nganu.delivery_dash.service;

import com.nganu.delivery_dash.entity.Session;
import com.nganu.delivery_dash.entity.User;
import com.nganu.delivery_dash.repository.SensorLogRepository;
import com.nganu.delivery_dash.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Satu-satunya pintu untuk MEMULAI sesi (web manual maupun RFID/Unity).
 *
 * Aturan (hanya ada 1 sepeda, jadi maksimal 1 sesi "active"):
 *  - tidak ada sesi aktif                     -> buat sesi baru
 *  - sesi aktif milik user yang SAMA          -> pakai sesi itu (tidak membuat duplikat)
 *  - sesi aktif milik user LAIN & masih segar -> 409 Conflict (TIDAK menimpa)
 *  - sesi aktif milik user lain & basi        -> ditandai "abandoned", lalu sesi baru dibuat
 *
 * "Basi" = tidak ada pembacaan valid (bpm terbaca & link Slave hidup) selama session.stale-minutes
 * (default 30 menit); jika belum ada pembacaan valid sama sekali, dihitung dari startTime.
 *
 * Method ini sengaja TIDAK @Transactional: synchronized + transaksi Spring melepas lock sebelum commit,
 * sehingga dua request bisa lolos bersamaan. Tanpa transaksi, tiap save() langsung commit di dalam lock.
 * Berlaku untuk SATU instance backend; untuk beberapa instance perlu kunci di level database.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SensorLogRepository sensorLogRepository;

    @Value("${session.stale-minutes:30}")
    private long staleMinutes;

    public record StartResult(Session session, boolean resumed) {}

    public synchronized StartResult startSession(User user, String source) {
        List<Session> actives = sessionRepository.findActiveWithUser();   // terbaru lebih dulu

        Session holder = null;
        for (Session s : actives) {
            if (holder == null && !isStale(s)) {
                holder = s;                       // sesi segar terbaru = pemegang sepeda
            } else {
                abandon(s, "stale/duplikat");     // basi, atau duplikat lama
            }
        }

        if (holder != null) {
            if (holder.getUser().getUserId().equals(user.getUserId())) {
                log.info("[session] {} login user={} -> melanjutkan sesi {}", source, user.getUserId(), holder.getSessionId());
                return new StartResult(holder, true);
            }
            log.warn("[session] {} login user={} DITOLAK: sepeda dipakai user={} (sesi {})",
                    source, user.getUserId(), holder.getUser().getUserId(), holder.getSessionId());
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Sepeda sedang dipakai oleh " + holder.getUser().getName()
                            + ". Akhiri sesi tersebut terlebih dahulu.");
        }

        Session created = sessionRepository.save(Session.builder()
                .user(user)
                .status("active")
                .weightKg(user.getWeightKg())
                .startTime(LocalDateTime.now())
                .build());
        log.info("[session] {} login user={} -> sesi baru {}", source, user.getUserId(), created.getSessionId());
        return new StartResult(created, false);
    }

    private boolean isStale(Session s) {
        LocalDateTime last = sensorLogRepository.findLastValidAt(s.getSessionId()).orElse(s.getStartTime());
        return last.isBefore(LocalDateTime.now().minusMinutes(staleMinutes));
    }

    private void abandon(Session s, String reason) {
        log.info("[session] sesi {} ditandai abandoned ({})", s.getSessionId(), reason);
        s.setStatus("abandoned");
        s.setEndTime(LocalDateTime.now());
        sessionRepository.save(s);
    }
}
