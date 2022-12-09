import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiAccountKey,
  mdiAccountEye,
  mdiAccountGroup,
  mdiPalette,
  mdiFacebook
} from '@mdi/js'

export default [
  {
    route: 'dashboard',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    route: 'permission.index',
    icon: mdiAccountKey,
    label: 'Permissions',
    can: 'permission list'
  },
  {
    route: 'role.index',
    icon: mdiAccountEye,
    label: 'Roles',
    can: 'role list'
  },
  {
    route: 'user.index',
    icon: mdiAccountGroup,
    label: 'Users',
    can: 'user list'
  },
  {
    href: 'https://github.com/balajidharma/laravel-vue-admin-panel',
    label: 'GitHub',
    icon: mdiGithub,
    target: '_blank'
  },
  {
    route: 'facebook.index',
    label: 'Facebook',
    icon: mdiFacebook,
    can: 'facebook'
  },
  {
    route: 'facebook.instruction',
    label: 'F. Auth Instruction',
    icon: mdiFacebook,
    can: 'facebook'
  }
]
