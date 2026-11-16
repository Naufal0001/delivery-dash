package com.nganu.delivery_dash.controller;

import com.nganu.delivery_dash.mqtt.MqttTestListener;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// GET http://localhost:8080/api/mqtt/status  -> cek koneksi MQTT tanpa membaca log
@RestController
@RequestMapping("/api/mqtt")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MqttTestController {

    private final MqttTestListener listener;

    @GetMapping("/status")
    public Map<String, Object> status() {
        return listener.snapshot();
    }
}
