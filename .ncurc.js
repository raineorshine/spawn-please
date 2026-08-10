module.exports = {
  "reject": [
    // eslint-config-standard (required by eslint-config-raine) peers on eslint ^8,
    // eslint-plugin-n ^15 || ^16, and eslint-plugin-promise ^6.
    // Wait till eslint-config-raine migrates to flat config to upgrade these.
    "eslint",
    "eslint-plugin-n",
    "eslint-plugin-promise"
  ]
}
