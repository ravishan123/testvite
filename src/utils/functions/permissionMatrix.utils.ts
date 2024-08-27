enum Role {
  OWNER = 'OWNER',
  COORDINATOR = 'COORDINATOR',
  SUPERVISOR = 'SUPERVISOR',
  SUPPORTER = 'SUPPORTER',
}

enum Action {
  VIEW_ORG_PROFILE = 'VIEW_ORG_PROFILE',
  VIEW_ORG_PUBLIC_PROFILE = 'VIEW_ORG_PUBLIC_PROFILE',
  Edit_ORG = 'EDIT_ORG',

  MANAGE_ROLES_OWNER_OWNER = 'MANAGE_ROLES_OWNER_OWNER',
  MANAGE_ROLES_OWNER_SUPERVISOR = 'MANAGE_ROLES_OWNER_SUPERVISOR',
  MANAGE_ROLES_OWNER_COORDINATOR = 'MANAGE_ROLES_OWNER_COORDINATOR',
  MANAGE_ROLES_OWNER_SUPPORTER = 'MANAGE_ROLES_OWNER_SUPPORTER',

  MANAGE_ROLES_SUPERVISOR_OWNER = 'MANAGE_ROLES_SUPERVISOR_OWNER',
  MANAGE_ROLES_SUPERVISOR_SUPERVISOR = 'MANAGE_ROLES_SUPERVISOR_SUPERVISOR',
  MANAGE_ROLES_SUPERVISOR_COORDINATOR = 'MANAGE_ROLES_SUPERVISOR_COORDINATOR',
  MANAGE_ROLES_SUPERVISOR_SUPPORTER = 'MANAGE_ROLES_SUPERVISOR_SUPPORTER',

  MANAGE_ROLES_COORDINATOR_OWNER = 'MANAGE_ROLES_COORDINATOR_OWNER',
  MANAGE_ROLES_COORDINATOR_SUPERVISOR = 'MANAGE_ROLES_COORDINATOR_SUPERVISOR',
  MANAGE_ROLES_COORDINATOR_COORDINATOR = 'MANAGE_ROLES_COORDINATOR_COORDINATOR',
  MANAGE_ROLES_COORDINATOR_SUPPORTER = 'MANAGE_ROLES_COORDINATOR_SUPPORTER',

  MANAGE_ROLES_SUPPORTER_OWNER = 'MANAGE_ROLES_SUPPORTER_OWNER',
  MANAGE_ROLES_SUPPORTER_SUPERVISOR = 'MANAGE_ROLES_SUPPORTER_SUPERVISOR',
  MANAGE_ROLES_SUPPORTER_COORDINATOR = 'MANAGE_ROLES_SUPPORTER_COORDINATOR',
  MANAGE_ROLES_SUPPORTER_SUPPORTER = 'MANAGE_ROLES_SUPPORTER_SUPPORTER',

  MANAGE_SUPPORTERS_OWNER = 'MANAGE_SUPPORTERS_OWNER',
  MANAGE_SUPPORTERS_SUPERVISOR = 'MANAGE_SUPPORTERS_SUPERVISOR',
  MANAGE_SUPPORTERS_COORDINATOR = 'MANAGE_SUPPORTERS_COORDINATOR',
  MANAGE_SUPPORTERS_SUPPORTER = 'MANAGE_SUPPORTERS_SUPPORTER',
}
type PermissionsMatrix = Record<Action, Record<Role, boolean>>;

const permissionMatrix: PermissionsMatrix = {
  [Action.VIEW_ORG_PROFILE]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: false,
  },
  [Action.VIEW_ORG_PUBLIC_PROFILE]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: true,
  },
  [Action.Edit_ORG]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: false,
  },

  // OWNER's possible senarios

  [Action.MANAGE_ROLES_OWNER_OWNER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_ROLES_OWNER_SUPERVISOR]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_ROLES_OWNER_COORDINATOR]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_ROLES_OWNER_SUPPORTER]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: false,
  },
  //MANAGE SUPPORTERS
  [Action.MANAGE_SUPPORTERS_OWNER]: {
    [Role.OWNER]: true,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_SUPPORTERS_SUPERVISOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: true,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_SUPPORTERS_COORDINATOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_SUPPORTERS_SUPPORTER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },

  // SUPERVISOR's possible senarios

  [Action.MANAGE_ROLES_SUPERVISOR_OWNER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_SUPERVISOR_SUPERVISOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_SUPERVISOR_COORDINATOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: true,
  },
  [Action.MANAGE_ROLES_SUPERVISOR_SUPPORTER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: true,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  // COORDINATOR's possible senarios

  [Action.MANAGE_ROLES_COORDINATOR_OWNER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_COORDINATOR_SUPERVISOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_COORDINATOR_COORDINATOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_COORDINATOR_SUPPORTER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  // SUPPORTER's possible senarios

  [Action.MANAGE_ROLES_SUPPORTER_OWNER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_SUPPORTER_SUPERVISOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_SUPPORTER_COORDINATOR]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
  [Action.MANAGE_ROLES_SUPPORTER_SUPPORTER]: {
    [Role.OWNER]: false,
    [Role.COORDINATOR]: false,
    [Role.SUPERVISOR]: false,
    [Role.SUPPORTER]: false,
  },
};

function canPerformAction(role: Role | undefined, action: Action): boolean {
  if (!role || !action) {
    return false;
  }

  const rolePermissions = permissionMatrix[action];
  if (!rolePermissions) {
    console.warn(`Action ${action} is not defined in the permission matrix.`);
    return false; // If action is not defined, assume no permission
  }

  const hasPermission = rolePermissions[role];
  if (hasPermission === undefined) {
    console.warn(`Role ${role} does not have a defined permission for action ${action}.`);
    return false;
  }

  return hasPermission;
}

export { Action, Role, canPerformAction };
