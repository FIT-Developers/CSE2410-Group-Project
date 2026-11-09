package com.campusmap.routing;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.campusmap.routing.model.*;
import java.util.ArrayList;
import java.util.List;


@RestController
public class RouteController {


	public record Coordinates(double lat, double lng) {}

	public record RouteRequest(
			Coordinates start,
			Coordinates destination
	) {}

	public record RouteResponse(List<List<Double>> path) {}

	@PostMapping("/api/route")
	public RouteResponse getRoute(@RequestBody RouteRequest request) {
		Coordinate start = new Coordinate(request.start().lat(), request.start().lng());
		Coordinate destination = new Coordinate(
				request.destination().lat(),
				request.destination().lng()
		);

		Node startNode = NodeReference.getClosestNode(start);
		Node destinationNode = NodeReference.getClosestNode(destination);

		List<List<Double>> path = new ArrayList<>();
		for (Node node : NodeReference.getRoute(startNode, destinationNode)) {
			Coordinate point = node.getCoordinates();
			path.add(List.of(point.getLat(), point.getLon()));
		}

		return new RouteResponse(path);
	}
}
