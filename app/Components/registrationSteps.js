const step1 = [
  {
    id: 1,
    stepName: "Register",
    header: "Registration",
    active: true,
    completed: false
  },
  {
    id: 2,
    stepName: "Activate",
    header: "Registration",
    active: false,
    completed: false
  },
  {
    id: 3,
    stepName: "Profile",
    header: "Registration",
    active: false,
    completed: false
  }
];

const step2 = [
  {
    id: 1,
    stepName: "Register",
    header: "Registration",
    active: false,
    completed: true
  },
  {
    id: 2,
    stepName: "Activate",
    header: "Registration",
    active: true,
    completed: false
  },
  {
    id: 3,
    stepName: "Profile",
    header: "Registration",
    active: false,
    completed: false
  }
];

const step3 = [
  {
    id: 1,
    stepName: "Register",
    header: "Registration",
    active: false,
    completed: true
  },
  {
    id: 2,
    stepName: "Activate",
    header: "Registration",
    active: false,
    completed: true
  },
  {
    id: 3,
    stepName: "Profile",
    header: "Registration",
    active: true,
    completed: false
  }
];

module.exports = {
  step1,
  step2,
  step3
};
