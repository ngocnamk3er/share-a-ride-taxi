package com.hust.baseweb.applications.programmingcontest.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ModelReponseCodeSimilaritySummaryParticipant {
    private String userId;
    private String fullname;
    private double highestSimilarity;

}
