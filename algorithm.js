function createRole(roleId, name) {
  return {
    roleId,
    name,
  };
}

// Example roles
const baseLevelEmployee = createRole(0, "Base Level Employee");
const manager = createRole(1, "Manager");

function createShiftPreference(day, shift, preferenceScore) {
  return {
    day,
    shift,
    preferenceScore,
  };
}

function createEmployee(name, role) {
  const preferences = [];

  function addPreference(preference) {
    preferences.push(preference);
  }

  return {
    name,
    role,
    preferences,
    addPreference,
  };
}

// Example employee
const employee1 = createEmployee("John Doe", baseLevelEmployee);
employee1.addPreference(createShiftPreference(0, 0, 5)); // Monday, morning shift, preference score 5
employee1.addPreference(createShiftPreference(0, 2, 4)); // Monday, night shift, preference score 4


function createSchedule(staffingNeeds, employees, employeeSeniority) {
  const schedule = {};

  // Helper function to sort employees based on preference score and seniority
  function sortEmployees(employeeA, employeeB, day, shift) {
    const preferenceScoreA = employeeA.preferences.find(
      (pref) => pref.day === day && pref.shift === shift
    ).preferenceScore;
    const preferenceScoreB = employeeB.preferences.find(
      (pref) => pref.day === day && pref.shift === shift
    ).preferenceScore;

    const seniorityA = employeeSeniority.find((sen) => sen.employee === employeeA).seniority;
    const seniorityB = employeeSeniority.find((sen) => sen.employee === employeeB).seniority;

    if (preferenceScoreA !== preferenceScoreB) {
      return preferenceScoreB - preferenceScoreA; // Higher preference score first
    }

    return seniorityB - seniorityA; // Higher seniority first
  }

  staffingNeeds.forEach((dayNeeds, day) => {
    schedule[day] = {};

    dayNeeds.forEach((shiftNeeds, shiftPeriod) => {
      schedule[day][shiftPeriod] = [];

      shiftNeeds.forEach((roleNeed, roleIndex) => {
        const matchingEmployees = employees.filter((employee) => employee.role.roleId === roleIndex);

        matchingEmployees.sort((employeeA, employeeB) =>
          sortEmployees(employeeA, employeeB, day, shiftPeriod)
        );

        const assignedEmployees = matchingEmployees.slice(0, roleNeed);
        schedule[day][shiftPeriod] = assignedEmployees;
      });
    });
  });

  return schedule;
}

const idealSchedule = createSchedule(staffingNeeds, [employee1, employee2], employeeSeniority);
