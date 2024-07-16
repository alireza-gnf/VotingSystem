import express from "express";
import * as Validator from "./validation";
import { users } from "./Model/User";
import { visions } from "./Model/Vision";
import { plans } from "./Model/Plan";
import { votes } from "./Model/Vote";

const app = express();
app.use(express.json());

const datePattern =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

// Register Endpoint
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ messages: ["Username and Password are required"] });
    return;
  }

  const messages: Array<string> = [];
  if (!Validator.isUnique(username, "username", users.all()))
    messages.push("Username already exists. Login or try a new one.");

  if (!Validator.hasEnoughLength(username, 3, 30))
    messages.push("Username length must be from 3 to 30");

  if (!Validator.hasEnoughLength(password, 8, 100))
    messages.push("Password length must be from 8 to 100");

  if (messages.length) {
    res.status(400).json({ messages });
    return;
  } else {
    users.add({
      username,
      password,
      role: "citizen",
    });
    res.status(201).send();
  }
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ messages: ["Username and Password are required."] });
    return;
  }

  const foundUser = users.filter({
    username,
    password,
  });
  if (foundUser) {
    res.status(200).send();
    return;
  }

  res.status(401).json({ messages: ["Credentials are incorrect."] });
});

// GET Visions Endpoint
app.get("/visions", (req, res) => {
  res.status(201).json({ data: visions.all() });
});

// POST Vision Endpoint
app.post("/visions", (req, res) => {
  const { title, description, planDateString, voteDateString } = req.body;
  if (!title || !description || !planDateString || !voteDateString) {
    res.status(400).json({
      messages: ["Title, Description and Deadline dates are required."],
    });
    return;
  }

  const messages: Array<string> = [];
  if (!Validator.hasEnoughLength(title, 10, 100))
    messages.push("Title length must be from 10 to 100.");

  if (!Validator.hasEnoughLength(description, 20, 500))
    messages.push("Description length must be from 20 to 500.");

  if (!Validator.matchRegex(planDateString, datePattern)) {
    messages.push("Planning deadline format is incorrect.");
  }

  if (!Validator.matchRegex(voteDateString, datePattern)) {
    messages.push("Voting deadline format is incorrect.");
  }

  if (messages.length) {
    res.status(400).json({ messages });
    return;
  }

  const currentTime: Date = new Date();
  const planDeadline = new Date(planDateString);
  const voteDeadline = new Date(voteDateString);
  if (
    !Validator.isAfterDate(
      planDeadline,
      new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)
    )
  ) {
    messages.push(
      "Planning deadline must be set to at least 24 hours from now"
    );
  }

  if (
    !Validator.isAfterDate(
      voteDeadline,
      new Date(planDeadline.getTime() + 24 * 60 * 60 * 1000)
    )
  ) {
    messages.push(
      "Voting deadline must be set to at least 24 hours from planning time"
    );
  }

  if (messages.length) {
    res.status(400).json({ messages });
    return;
  }

  visions.add({
    title,
    description,
    planDeadline,
    voteDeadline,
  });
  res.status(201).send();
});

// GET Plans of a specific Vision
app.get("/visions/:id/plans", (req, res) => {
  if (visions.find(req.params.id)) {
    const data = plans.visionPlans(req.params.id);
    res.status(200).json({ data });
    return;
  }

  res.status(404).send();
});

// POST Plan for a specific Vision
app.post("/visions/:id/plans", (req, res) => {
  const visionId = req.params.id;
  const vision = visions.find(visionId);
  if (!vision) {
    res.status(404).send();
    return;
  }

  if (!Validator.isAfterDate(vision.planDeadline, new Date())) {
    res
      .status(400)
      .json({ messages: ["Planning Deadline for this vision has passed."] });

    return;
  }

  const { description } = req.body;
  if (!description) {
    res.status(400).json({ messages: ["Description is required."] });
    return;
  }

  if (!Validator.hasEnoughLength(description, 20, 1000)) {
    res
      .status(400)
      .json({ messages: ["Description length must be from 20 to 1000"] });

    return;
  }

  // before implementation of authentication and authorization system
  const userId = "2";
  plans.add({ visionId, description, userId });
  res.status(201).send();
});

// GET Votes of a specific Plan
app.get("/plans/:id/votes", (req, res) => {
  const plan = plans.find(req.params.id);
  if (plan) {
    const data = {
      vision: visions.find(plan.visionId),
      plan: plan,
      votes: votes.planVotes(plan.id!),
    };

    res.status(200).json({ data });
    return;
  }

  res.status(404).send();
});

// POST Vote for a specific Plan
app.post("/plans/:id/votes", (req, res) => {
  const planId = req.params.id;
  const plan = plans.find(planId);
  if (!plan) {
    res.status(404).send();
    return;
  }

  const vision = visions.find(plan.visionId)!;
  const messages: Array<string> = [];
  const currentTime = new Date();
  if (Validator.isAfterDate(vision.planDeadline, currentTime))
    messages.push("Voting for this vision has not yet started.");
  if (Validator.isAfterDate(currentTime, vision.voteDeadline))
    messages.push("Voting deadline for this vision has passed.");

  if (messages.length) {
    res.status(400).json({ messages });
    return;
  }

  // before implementation of authentication and authorization system
  const userId = "4";
  votes.add({
    planId,
    userId,
  });
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
