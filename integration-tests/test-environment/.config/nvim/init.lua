-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "--branch=v11.16.2",
    lazyrepo,
    lazypath,
  })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

-- Make sure to setup `mapleader` and `maplocalleader` before
-- loading lazy.nvim so that mappings are correct.
-- This is also a good place to setup other settings (vim.opt)
vim.g.mapleader = " "
vim.g.maplocalleader = " "
vim.o.swapfile = false

local thisfile = vim.fn.expand("<sfile>")
local repo_root = vim.fn.fnamemodify(thisfile, ":h:h:h:h:h:h:h")

-- install the following plugins
---@module "lazy"
---@type LazySpec
local plugins = {
  {
    "mikavilpas/nucleo.nvim",
    -- for tests, always use the code from this repository
    dir = repo_root,
    event = "VeryLazy",
    config = true,
  },
  {
    "nvim-telescope/telescope.nvim",
    event = "VeryLazy",
    keys = {
      { "<down>", "<cmd>Telescope find_files<cr>" },
    },
    opts = {
      defaults = {
        preview = false,
        layout_strategy = "horizontal",
        layout_config = { prompt_position = "top" },
        sorting_strategy = "ascending",
      },
    },
  },
  { "catppuccin/nvim", name = "catppuccin", priority = 1000 },
}
require("lazy").setup({ spec = plugins })

vim.cmd.colorscheme("catppuccin-macchiato")
