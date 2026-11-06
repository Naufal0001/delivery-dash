package com.nganu.delivery_dash.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataResponse {
    // Array untuk sumbu X (Label Waktu)
    private List<String> labels;

    // Array untuk sumbu Y1 (Grafik Garis Detak Jantung)
    private List<Integer> bpmData;

    // Array untuk sumbu Y2 (Grafik Garis Kecepatan Kayuhan)
    private List<Double> rpmData;
}