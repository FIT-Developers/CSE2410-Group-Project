package com.campusmap.routing;


import org.springframework.web.bind.annotation.RestController;



public record ClassRequest(String name, String day, String start, String end, String loc, String room, String color) {

}