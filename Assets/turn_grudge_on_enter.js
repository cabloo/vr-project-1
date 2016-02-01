#pragma strict

public var Grudge: GameObject;
public var FaceDoor: Quaternion;
public var OriginalRotation: Quaternion;

private var smooth = 1.0f;
private var inRoom = false;

function Start () {
	if (Grudge == null) {
		Grudge = GameObject.FindGameObjectsWithTag("Grudge")[0];
	}

	OriginalRotation = Grudge.transform.rotation;
	FaceDoor = new Quaternion();
	FaceDoor.eulerAngles = OriginalRotation.eulerAngles + Vector3.down * 180;
}

function Update () {
	var target = inRoom ? FaceDoor : OriginalRotation;
	Grudge.transform.rotation = Quaternion.Slerp(Grudge.transform.rotation, target, Time.deltaTime * smooth);
}

function OnTriggerEnter (other: Collider) {
	inRoom = !inRoom;
}