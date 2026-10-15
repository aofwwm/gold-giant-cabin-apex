//#region node_modules/.nitro/vite/services/ssr/assets/family-day-CMmGyjLO.js
function clockLabel(minutes) {
	const day = (minutes % 1440 + 1440) % 1440;
	const hour24 = Math.floor(day / 60);
	const mins = day % 60;
	const suffix = hour24 >= 12 ? "PM" : "AM";
	return `${hour24 % 12 === 0 ? 12 : hour24 % 12}:${String(mins).padStart(2, "0")} ${suffix}`;
}
function bufferMinutes(pace) {
	if (pace === "relaxed") return 15;
	if (pace === "packed") return 5;
	return 10;
}
function stampDay(input) {
	const stops = [];
	let cursor = input.startMin;
	const gap = bufferMinutes(input.pace);
	stops.push({
		id: "leave",
		kind: "leave",
		title: `Leave ${input.start.title}`,
		address: input.start.address,
		latitude: input.start.latitude,
		longitude: input.start.longitude,
		startMin: cursor,
		endMin: cursor,
		setting: "",
		travelMin: null,
		travelLabel: "",
		cost: null,
		ages: "",
		why: input.start.title,
		placeId: "start",
		liveLabel: "",
		opening: ""
	});
	const pushRest = (from, to, title) => {
		if (to <= from) return;
		stops.push({
			id: `rest-${from}`,
			kind: "rest",
			title,
			address: "",
			latitude: input.start.latitude,
			longitude: input.start.longitude,
			startMin: from,
			endMin: to,
			setting: "",
			travelMin: null,
			travelLabel: "",
			cost: null,
			ages: "",
			why: "Breathing room. Nothing is booked.",
			placeId: "",
			liveLabel: "",
			opening: ""
		});
	};
	for (const leg of input.legs) {
		const travel = leg.travelMin ?? 0;
		if (input.nap && leg.kind === "activity" && cursor < input.nap.end && cursor + travel + leg.duration > input.nap.start) {
			pushRest(Math.max(cursor, input.nap.start), input.nap.end, "Nap / rest");
			cursor = input.nap.end;
		}
		const arrival = cursor + travel;
		const finish = arrival + leg.duration;
		if (leg.kind !== "rest" && finish > input.endMin - 20) continue;
		cursor = arrival;
		stops.push({
			id: `${leg.kind}-${leg.placeId || leg.title}`,
			kind: leg.kind,
			title: leg.title,
			address: leg.address,
			latitude: leg.latitude,
			longitude: leg.longitude,
			startMin: cursor,
			endMin: cursor + leg.duration,
			setting: leg.setting,
			travelMin: leg.travelMin,
			travelLabel: leg.travelLabel,
			cost: leg.cost,
			ages: leg.ages,
			why: leg.why,
			placeId: leg.placeId,
			liveLabel: leg.placeId ? "ANYTIME" : "",
			opening: leg.opening
		});
		cursor += leg.duration + (leg.kind === "rest" ? 0 : gap);
	}
	const homeArrival = cursor + (input.returnTravelMin ?? 0);
	stops.push({
		id: "return",
		kind: "return",
		title: "Travel back",
		address: input.end.address,
		latitude: input.end.latitude,
		longitude: input.end.longitude,
		startMin: cursor,
		endMin: homeArrival,
		setting: "",
		travelMin: input.returnTravelMin,
		travelLabel: input.returnTravelLabel,
		cost: null,
		ages: "",
		why: input.end.title,
		placeId: "end",
		liveLabel: "",
		opening: ""
	});
	stops.push({
		id: "home",
		kind: "home",
		title: input.end.title,
		address: input.end.address,
		latitude: input.end.latitude,
		longitude: input.end.longitude,
		startMin: homeArrival,
		endMin: homeArrival,
		setting: "",
		travelMin: null,
		travelLabel: "",
		cost: null,
		ages: "",
		why: "",
		placeId: "end",
		liveLabel: "",
		opening: ""
	});
	return stops;
}
//#endregion
export { stampDay as n, clockLabel as t };
