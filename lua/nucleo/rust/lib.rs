use nucleo_matcher::pattern::{CaseMatching, Normalization, Pattern};
use nucleo_matcher::{Config, Matcher, Utf32Str};

use mlua::prelude::*;
use mlua::Lua;

#[derive(Debug)]
pub struct ScoreAndIndices {
    pub score: i32,
    pub indices: Vec<u32>,
}

impl IntoLua for ScoreAndIndices {
    fn into_lua(self, lua: &Lua) -> LuaResult<LuaValue> {
        let table = lua.create_table()?;
        table.set("score", self.score)?;
        table.set("indices", self.indices)?;

        Ok(LuaValue::Table(table))
    }
}

// NOTE: skip_memory_check greatly improves performance
// https://github.com/mlua-rs/mlua/issues/318
#[mlua::lua_module(skip_memory_check)]
fn nucleo_nvim(lua: &Lua) -> LuaResult<LuaTable> {
    let exports = lua.create_table()?;
    exports.set(
        "score",
        lua.create_function(|_, (needle, haystack): (String, String)| {
            Ok(get_score(needle, haystack))
        })?,
    )?;

    Ok(exports)
}

#[inline(always)]
fn get_score(needle: String, haystack: String) -> ScoreAndIndices {
    let pattern = Pattern::parse(&needle, CaseMatching::Ignore, Normalization::Smart);
    // the indices of the matched characters in the haystack
    let mut indices: Vec<u32> = Vec::new();

    let mut matcher = Matcher::new(Config::DEFAULT.match_paths());
    let score = pattern
        .indices(
            Utf32Str::new(&haystack, &mut Vec::new()),
            &mut matcher,
            &mut indices,
        )
        .map(|s| s as i32)
        .unwrap_or(-1);
    indices.sort_unstable();
    indices.dedup();

    ScoreAndIndices { score, indices }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_score_match() {
        let result = get_score("ro".to_string(), "rollback".to_string());
        assert_eq!(result.score, 59);
    }

    #[test]
    fn test_score_no_match() {
        let result = get_score("ro".to_string(), "back".to_string());
        assert_eq!(result.score, -1);
    }
}
