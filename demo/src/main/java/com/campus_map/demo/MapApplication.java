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

		ObjectMapper objectMapper = new ObjectMapper();
		Graph graph = new Graph(); 
		Building[] buildings = new Building[100]; 

		JsonNode jsonNode = objectMapper.readTree(new File("demo/src/main/resources/data/buildings.json"));
		JsonNode buildingsNode = jsonNode.get("buildings");

		for (JsonNode buildingNode : buildingsNode) {
			graph.addNode(buildingNode.get("name").asText(), buildingNode.get("longitude").floatValue(), buildingNode.get("latitude").floatValue());
		}
			

			System.out.println("Current working directory: ");
		System.out.println(System.getProperty("user.dir"));
		SpringApplication.run(MapApplication.class, args);
	

	}
}
