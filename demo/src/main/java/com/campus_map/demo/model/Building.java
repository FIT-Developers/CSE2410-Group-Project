package com.campus_map.demo.model;
import java.util.ArrayList; 
public class Building {
    private int id;
    private String name; 

    private Node entranceNode; 
    private ArrayList<Coordinate> boundary; 

    public Building(int id, String name, Node entranceNode, ArrayList<Coordinate> boundary){
        this.id = id;
        this.name = name; 
        this.entranceNode = entranceNode; 
        this.boundary = boundary;
    }

    public int getId(){
        return id; 
    }

    public String getName(){
        return name; 
    }

    public Node getEntranceNode(){
        return entranceNode;
    }

    public ArrayList<Coordinate> getBoundaryList(){
        return boundary; 
    }
}
