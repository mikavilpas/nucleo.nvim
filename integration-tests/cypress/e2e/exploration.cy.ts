import type { MyTestDirectoryFile } from "MyTestDirectory"

describe("usage of pattern Atoms", () => {
  it("supports fuzzy_match (AtomKind::Atom)", () => {
    cy.visit("/")
    cy.startNeovim().then(async () => {
      cy.contains("If you see this text, Neovim is ready! 🎉")

      cy.typeIntoTerminal("{downArrow}")
      cy.contains("Find Files")

      // Fuzzy matching where the needle must match any haystack characters
      // (match can contain gaps). This atom kind is used by default if no
      // special syntax is used. There is no negated fuzzy matching (too
      // many false positives).
      cy.typeIntoTerminal("osf")
      cy.contains(
        "other-subdirectory/other-sub-file.txt" satisfies MyTestDirectoryFile,
      )
    })
  })

  describe("support for AtomKind::Substring", () => {
    // The needle must match a contiguous sequence of haystack characters
    // without gaps.  This atom kind is parsed from the following syntax:
    // `'foo` and `!foo` (negated).

    it("supports positive Substring ('pattern)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test `'`. It should only show the files that contain the substring
        // as contiguous characters, disabling fuzzy matching
        cy.contains(
          "subdirectory/subdirectory-file.txt" satisfies MyTestDirectoryFile,
        )
        cy.typeIntoTerminal("'ot")
        cy.contains(
          "other-subdirectory/other-sub-file.txt" satisfies MyTestDirectoryFile,
        )
        cy.contains(
          "subdirectory/subdirectory-file.txt" satisfies MyTestDirectoryFile,
        ).should("not.exist")
      })
    })

    it("supports negative Substring (!pattern)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test !. It should hide the files that contain the substring
        cy.contains("file2.txt" satisfies MyTestDirectoryFile)
        cy.typeIntoTerminal("!2")
        cy.contains("file2.txt" satisfies MyTestDirectoryFile).should(
          "not.exist",
        )
      })
    })
  })

  describe("support for AtomKind::Prefix", () => {
    // The needle must match all leading haystack characters without gaps or
    // prefix. This atom kind is parsed from the following syntax: `^foo` and
    // `!^foo` (negated).

    it("supports positive Prefix (^pattern)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test `^`. It should only show the files that start with the
        // substring, disabling fuzzy matching
        const showfile =
          "subdirectory/subdirectory-file.txt" satisfies MyTestDirectoryFile
        const hidefile =
          "other-subdirectory/other-sub-file.txt" satisfies MyTestDirectoryFile

        cy.contains(showfile)
        cy.contains(hidefile)
        cy.typeIntoTerminal("^sub")
        cy.contains(showfile)
        cy.contains(hidefile).should("not.exist")
      })
    })

    it("supports negative Prefix (!^pattern)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test !^. It should hide the files that start with the substring
        const hidefile =
          "subdirectory/subdirectory-file.txt" satisfies MyTestDirectoryFile
        const showfile = "file2.txt" satisfies MyTestDirectoryFile

        cy.contains(hidefile)
        cy.contains(showfile)
        cy.typeIntoTerminal("!^sub")
        cy.contains(hidefile).should("not.exist")
        cy.contains(showfile)
      })
    })
  })

  describe("support for AtomKind::Postfix", () => {
    // The needle must match all trailing haystack characters without gaps or
    // postfix. This atom kind is parsed from the following syntax: `foo$` and
    // `!foo$` (negated).

    it("supports positive Postfix (pattern$)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test `$`. It should only show the files that end with the substring,
        // disabling fuzzy matching
        const showfile = "luafile.lua" satisfies MyTestDirectoryFile
        const hidefile = "file3.txt" satisfies MyTestDirectoryFile

        cy.contains(showfile)
        cy.contains(hidefile)
        cy.typeIntoTerminal("lua$")
        cy.contains(showfile)
        cy.contains(hidefile).should("not.exist")
      })
    })

    it("supports negative Postfix (!pattern$)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test !$. It should hide the files that end with the substring
        const hidefile = "luafile.lua" satisfies MyTestDirectoryFile
        const showfile = "file3.txt" satisfies MyTestDirectoryFile

        cy.contains(hidefile)
        cy.contains(showfile)
        cy.typeIntoTerminal("!lua$")
        cy.contains(hidefile).should("not.exist")
        cy.contains(showfile)
      })
    })
  })

  describe("support for AtomKind::Exact", () => {
    // The needle must match all haystack characters without gaps or prefix.
    // This atom kind is parsed from the following syntax: `^foo$` and `!^foo$`
    // (negated).

    it.skip("supports negative Exact (!^pattern$)", () => {
      // too lazy to test this
    })

    it("supports positive Exact (^pattern$)", () => {
      cy.visit("/")
      cy.startNeovim().then(async () => {
        cy.contains("If you see this text, Neovim is ready! 🎉")

        cy.typeIntoTerminal("{downArrow}")
        cy.contains("Find Files")

        // test `^$`. It should only show the files that are exactly the
        // substring, disabling fuzzy matching
        const showfile = "file2.txt" satisfies MyTestDirectoryFile
        const hidefile = "file3.txt" satisfies MyTestDirectoryFile

        cy.contains(showfile)
        cy.contains(hidefile)
        cy.typeIntoTerminal(`^${showfile}$`)
        cy.contains(showfile)
        cy.contains(hidefile).should("not.exist")
      })
    })
  })
})
