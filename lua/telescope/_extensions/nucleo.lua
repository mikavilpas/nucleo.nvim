local make_sorter = function()
  local rust_nucleo = require("nucleo.rust.rust")

  local sorters = require("telescope.sorters")
  return sorters.new({
    -- TODO the score and highlighting are called sequentially, so we could cache the response to save resources

    -- Called for each line (e.g. each file path) to determine the score. The
    -- score is used to show the lines in the correct order (best matches first
    -- so the user quickly finds what they want). A lower score seems to be
    -- considered a better match in telescope.
    ---@param self Sorter
    ---@param needle string # the current prompt - the text the user wants to filter the results by
    ---@param haystack string # the text for the current line, e.g. `mydir/file_1.txt`
    ---@return number # a score for the line, higher is better
    ---@diagnostic disable-next-line: unused-local
    scoring_function = function(self, needle, haystack)
      -- https://github.com/nvim-telescope/telescope.nvim?tab=readme-ov-file#sorters
      local result = rust_nucleo.score(needle, haystack)

      if result.score < 0 then
        -- this removes the item from the matches
        return -1
      end

      -- the score must be an integer/float between 0 and 1
      local score = math.abs(1 / (result.score + 1))
      return score
    end,

    -- Called for each line to determine the parts of the line that have
    -- matched the search. This is used to highlight the matching parts of the
    -- line, so that the user can intuitively see how the matching algorithm is
    -- working, and maybe make adjustments to better match the desired results.
    ---@param self Sorter
    ---@param needle string # the current prompt - the text the user wants to filter the results by
    ---@param haystack string # the text for the current line, e.g. `mydir/file_1.txt`
    ---@diagnostic disable-next-line: unused-local
    highlighter = function(self, needle, haystack)
      local result = rust_nucleo.score(needle, haystack)
      local indices = result.indices

      -- telescope uses 1-based indexing - adjust
      for i, index in ipairs(indices) do
        indices[i] = index + 1
      end

      return result.indices
    end,
  })
end

local config = {}

return require("telescope").register_extension({
  setup = function(ext_config, tele_config)
    assert(
      #ext_config == 0,
      "This extension does not currently accept configuration options"
    )
    config = vim.tbl_deep_extend("force", config, ext_config or {})

    tele_config.file_sorter = function()
      return make_sorter()
    end
  end,

  exports = {
    native_nucleo_scorer = function(opts)
      assert(
        #opts == 0,
        "This extension does not currently accept configuration options"
      )
      return make_sorter()
    end,

    get_config = function()
      return config
    end,
  },
})
