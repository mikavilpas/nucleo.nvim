# ⚛️nucleo.nvim

> [!NOTE]
>
> This is currently experimental software. It works, but is in an early stage of
> development.

An integration to the [nucleo-matcher](https://github.com/helix-editor/nucleo)
algorithm for Neovim. It's the fuzzy matching algorithm used in the Helix editor
to find files.

## ✨ Features

This includes a lua-rust api to use the
[nucleo-matcher](https://crates.io/crates/nucleo-matcher) rust crate. Using
this, the following features are provided:

- A [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) sorter,
  which allows using the nucleo algorithm with telescope.
- A lua api to use the nucleo algorithm directly.

## 📦 Installation

Right now, no binaries are published, so you need to build the rust side of the
plugin yourself.

Using [lazy.nvim](https://lazy.folke.io/):

```lua
---@module "lazy"
---@type LazySpec
return {
  "mikavilpas/nucleo.nvim",
  build = "cargo build --release",
  config = true,
  -- it sets itself as the default sorter for telescope's find_files (file
  -- picker)
}
```

## 🤔 Alternatives

- [telescope-fzf-native.nvim](https://github.com/nvim-telescope/telescope-fzf-native.nvim)
  allows using a C language port of the fzf algorithm with telescope
- [fzf-lua](https://github.com/ibhagwan/fzf-lua) is a mature fuzzy finder for
  Neovim. It uses the [fzf](https://github.com/junegunn/fzf) command-line fuzzy
  finder under the hood.
