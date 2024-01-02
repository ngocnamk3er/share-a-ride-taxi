import { MenuItem, TextField } from "@mui/material";
import React from "react";
import {
  COMPUTER_LANGUAGES,
  mapLanguageToDisplayName,
} from "../education/programmingcontestFE/Constant";

const HustCodeLanguagePicker = (props) => {
  const { listLanguagesAllowed, language, onChangeLanguage, classRoot, ...remainProps } = props;
  //const { language, onChangeLanguage, classRoot, ...remainProps } = props;

  const getLanguage = (language) => {
    if (!language) return COMPUTER_LANGUAGES.CPP17;
    if (language === "CPP") return COMPUTER_LANGUAGES.CPP17;
    return language;
  };

  return (
    <TextField
      sx={{ minWidth: 128 }}
      {...remainProps}
      className={`${classRoot}`}
      variant={"outlined"}
      size={"small"}
      autoFocus
      value={getLanguage(language)}
      select
      id="computerLanguage"
      onChange={onChangeLanguage}
    >
      {Object.values(COMPUTER_LANGUAGES).map((item) => (
        <MenuItem key={item} value={item}>
          {mapLanguageToDisplayName(item)}
        </MenuItem>
      ))}
      {/*listLanguagesAllowed != null ? listLanguagesAllowed.map((item) => (
        <MenuItem key={item} value={item}>
          {mapLanguageToDisplayName(item)}
        </MenuItem>
      )):""*/}
    </TextField>
  );
};

export default React.memo(HustCodeLanguagePicker);
