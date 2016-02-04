#pragma strict

public var Grudge: GameObject;
public var OffsetPosition: Vector3;
public var sound: AudioSource;

private var TargetPosition: Vector3;
private var OriginalPosition: Vector3;
private var OriginalScale: Vector3;
private var TargetScale: Vector3;
private var FaceDoor: Quaternion;
private var OriginalRotation: Quaternion;
public var times = 10;
public var smooth = 1.0f;
private var inRoom = false;
private var timesCounter = 0;

function Start () {
	OriginalRotation = Grudge.transform.rotation;
	FaceDoor = Rotate180(OriginalRotation);
	OriginalPosition = Grudge.transform.position;
	OriginalScale = Grudge.transform.localScale;
	TargetScale = Grudge.transform.localScale - new Vector3(0.3, 0.3, 0.3);
	TargetPosition = OffsetPosition + OriginalPosition;
	sound = sound ? sound : GetComponent(AudioSource);
}

function Update () {
	if (!inRoom) {
		return;
	}

	var target = GetTargetRotation();
	var targetPos = inRoom ? TargetPosition : OriginalPosition;
	var targetScale = inRoom ? TargetScale : OriginalScale;

	Grudge.transform.rotation = Quaternion.Slerp(Grudge.transform.rotation, target, Time.deltaTime * smooth * times);
	Grudge.transform.position = Vector3.Slerp(Grudge.transform.position, targetPos, Time.deltaTime * smooth);
	Grudge.transform.localScale = Vector3.Slerp(Grudge.transform.localScale, targetScale, Time.deltaTime * smooth);

	if (Vector3.Distance(Grudge.transform.position, targetPos) < 15) {
		KillGrudge();
	}
}

function KillGrudge () {
	for (var grudge in GameObject.FindGameObjectsWithTag("Grudge")) {
		GameObject.Destroy(grudge);
	}
}

function OnTriggerEnter (other: Collider) {
	inRoom = !inRoom;
	timesCounter = inRoom ? times : 0;
	
	if (sound) {
		sound.Play();
	}
}

function GetTargetRotation(): Quaternion {
	if (!timesCounter) {
		return FaceDoor;
	}

	var rot = new Quaternion();
	rot.eulerAngles = Grudge.transform.rotation.eulerAngles;
	var diffAngle = Quaternion.Angle(Grudge.transform.rotation, FaceDoor);
	var resetAngle = 25;

	if (diffAngle < resetAngle && timesCounter > 0) {
		if (timesCounter < 5) {
			rot.eulerAngles = rot.eulerAngles - Vector3.forward * 20;
		}
		timesCounter--;
		FaceDoor = Rotate180(rot);
	}

	return FaceDoor;
}

function Rotate180(rot: Quaternion): Quaternion {
	var ret = new Quaternion();
	ret.eulerAngles = rot.eulerAngles - Vector3.down * 170;

	return ret;
}