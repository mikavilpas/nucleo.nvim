local M = {}

--- @return string
local function get_lib_extension()
  if jit.os:lower() == "mac" or jit.os:lower() == "osx" then
    return ".dylib"
  end
  if jit.os:lower() == "windows" then
    return ".dll"
  end
  return ".so"
end

-- search for the lib in the /target/release directory with and without the lib prefix
-- since MSVC doesn't include the prefix
package.cpath = package.cpath
  .. ";"
  .. debug.getinfo(1).source:match("@?(.*/)")
  .. "../../../target/release/lib?"
  .. get_lib_extension()
  .. ";"
  .. debug.getinfo(1).source:match("@?(.*/)")
  .. "../../../target/release/?"
  .. get_lib_extension()

-- load the rust library, and return a reference to the module
local nucleo_rust = require("nucleo_nvim")

---@class nucleo.ScoreAndIndices
---@field score number
---@field indices number[]

---@param needle string
---@param haystack string
---@return nucleo.ScoreAndIndices
function M.score(needle, haystack)
  return nucleo_rust.score(needle, haystack)
end

return M
