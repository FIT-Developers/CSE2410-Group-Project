package com.campus_map.demo;
import java.util.TreeSet; 
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File; 
import java.util.ArrayList; 
import com.campus_map.demo.model.*;
public class MapBuilder {

    class Mnode{
        int id; 
        float lat; 
        float lon; 
        public Mnode(int id, float lat, float lon){
            this.id = id;
            this.lat = lat; 
            this.lon = lon; 
        }
    }

    class Way{

        int id; 
        Integer[] nodes; 

        public Way(int id, int arrSize){
            this.id = id; 
            this.nodes = new Integer[arrSize]; 
        }

    }
    private TreeSet<Way> waySet; 
    private TreeSet<Mnode> nodeSet; 

    public MapBuilder() throws Exception{ 
        ObjectMapper mapper = new ObjectMapper(); 
        nodeSet = new TreeSet<>();
        waySet = new TreeSet<>(); 

        JsonNode root = mapper.readTree(new File("demo/src/main/resources/data/quad-test-connected-list.json"));
        JsonNode elements = root.get("elements"); 
        for (JsonNode curWay : elements){
            int id = curWay.get("id").asInt(); 
            JsonNode curNodeList = curWay.get("nodes"); 
            int arrSize = curNodeList.size(); 
            Way newWay = new Way(id, arrSize); 
            newWay.nodes = curWay.POJO("nodes", new Integer[arrSize]);

            
        }
    }
    
