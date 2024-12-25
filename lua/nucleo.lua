local M = {}

M.version = "1.0.0" -- x-release-please-version

M.config = {}

function M.setup()
  require("telescope._extensions.nucleo")
  require("telescope").load_extension("nucleo")
end

M.rust = require("nucleo.rust.rust")

return M
