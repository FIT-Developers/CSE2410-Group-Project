package com.campusmap.routing;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

		double startLat = request.start().lat();
		double startLng = request.start().lng();

		double destinationLat = request.destination().lat();
		double destinationLng = request.destination().lng();

		List<List<Double>> path = new ArrayList<>();
		path.add(List.of(startLat, startLng));
		path.add(List.of(destinationLat, destinationLng));

		return new RouteResponse(path);
	}
}
