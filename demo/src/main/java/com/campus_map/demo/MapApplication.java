package com.campus_map.demo;
import java.io.File;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.campus_map.demo.model.*;
@SpringBootApplication
public class MapApplication {

	public static void main(String[] args) throws Exception {

		MapBuilder mb = new MapBuilder(); 

		SpringApplication.run(MapApplication.class, args);
	

	}
}
