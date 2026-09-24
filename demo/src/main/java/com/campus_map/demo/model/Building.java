package com.campus_map.demo.model;
import java.util.ArrayList; 
public class Building {
    private int id;
    private String name; 
    private ArrayList<Coordinate> boundary; 

    public Building(String name, Coordinate entrance, ArrayList<Coordinate> boundary){
        this.name = name; 
        this.boundary = boundary;
    }

    public int getId(){
        return id; 
    }

    public String getName(){
        return name; 
    }


    public ArrayList<Coordinate> getBoundaryList(){
        return boundary; 
    }
}
