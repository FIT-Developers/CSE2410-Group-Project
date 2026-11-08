package com.campus_map.demo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class MapApplication {

	public static void main(String[] args) throws Exception {

		MapBuilder mb = new MapBuilder(); 

		SpringApplication.run(MapApplication.class, args);
	

	}
}
