#pragma strict

public var Grudge: GameObject;
public var times = 1;
public var smooth = 1.0f;
public var OffsetPosition: Vector3;
public var sound: AudioSource;

private var TargetPosition: Vector3;
private var OriginalPosition: Vector3;
private var FaceDoor: Quaternion;
private var OriginalRotation: Quaternion;
private var inRoom = false;
private var timesCounter = 0;
private var finished = false;

function Start () {
	OriginalRotation = Grudge.transform.rotation;
	FaceDoor = Rotate180(OriginalRotation);
	OriginalPosition = Grudge.transform.position;
	TargetPosition = OriginalPosition + OffsetPosition;
	sound = sound ? sound : GetComponent(AudioSource);
}

function Update () {
	if (finished) {
		return;
	}

	var target = GetTargetRotation();
	var targetPos = inRoom ? TargetPosition : OriginalPosition;

	Grudge.transform.rotation = Quaternion.Slerp(Grudge.transform.rotation, target, Time.deltaTime * smooth * times);
	Grudge.transform.position = Vector3.Slerp(Grudge.transform.position, targetPos, Time.deltaTime * smooth);
}

function OnTriggerEnter (other: Collider) {
	inRoom = !inRoom;
	finished = false;
	timesCounter = inRoom ? times - 1 : 0;

	if (sound) {
		sound.Play();
	}
}

function GetTargetRotation() {
	var diffAngle = Quaternion.Angle(Grudge.transform.rotation, FaceDoor);
	if (!timesCounter) {
		finished = diffAngle < 2;
		return inRoom ? FaceDoor : OriginalRotation;
	}

	var resetAngle = 25;
	if (diffAngle < resetAngle && timesCounter > 0) {
		timesCounter--;
		FaceDoor = Rotate180(finished ? OriginalRotation : Grudge.transform.rotation);
	}

	return FaceDoor;
}

function Rotate180(rot: Quaternion): Quaternion {
	var ret = new Quaternion();
	ret.eulerAngles = rot.eulerAngles + Vector3.down * 170;

	return ret;
}