Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");

if (Meteor.isClient) {
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
	Meteor.subscribe("rooms");
	Meteor.subscribe("messages");
	Session.setDefault("roomname", "Settlin");
	Template.input.events({
		"click .btn": function() {
			_sendMessage();
		},
		"keyup #msg": function(e) {
			if (e.type === "keyup" && e.which === 13) {
				_sendMessage();
			}
		}
	});
	_sendMessage = function() {
		var el = document.getElementById("msg");
		if (el.value.trim().length) {
			Messages.insert({user: Meteor.user().username, msg: el.value, ts: new Date(), room: Session.get("roomname")});
		}
		else {
			alert("Please enter a message and then submit");
		}
		el.value = "";
		el.focus();
	};

	Template.messages.helpers({
		messages: function() {
			return Messages.find({room: Session.get("roomname")}, {sort: {ts: -1}});
		},
		roomname: function() {
			return Session.get("roomname");
		}
	});

	Template.message.helpers({
		timestamp: function() {
			return this.ts.toLocaleString();
		}
	});

	Template.rooms.events({
		"click li": function(e) {
			Session.set("roomname", e.target.innerText);
		}
	});

	Template.rooms.helpers({
		rooms: function() {
			return Rooms.find();
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function() {
		//Messages.remove({});
		Rooms.remove({});
		if (Rooms.find().count() === 0) {
			["Settlin", "Linking"].forEach(function(r) {
				Rooms.insert({roomname: r});
			});
		}
	});
	Rooms.deny({
		insert: function(userId, doc) {
			return true;
		},
		update: function(userId, doc, fieldNames, modifier) {
			return true;
		},
		remove: function(userId, doc) {
			return true;
		}
	});
	Messages.deny({
		insert: function(userId, doc) {
			return (userId === null);
		},
		update: function(userId, doc, fieldNames, modifier) {
			return true;
		},
		remove: function(userId, doc) {
			return true;
		}
	});
	Messages.allow({
		insert: function(userId, doc) {
			return (userId !== null);
		}
	});
	Meteor.publish("rooms", function() {
		return Rooms.find();
	});
	Meteor.publish("messages", function() {
		return Messages.find({}, {sort: {ts: -1}});
	});
}
