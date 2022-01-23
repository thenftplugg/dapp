import React from "react";

function EditableText({value, edit, setEdit, onChange}) {
  if (edit) {
    return <input autoFocus onBlur={() => setEdit(false)} onChange={(e) => onChange(e.target.value)} className="form-control" />
  } else {
    return <h5 className="mb-0 font-weight-normal">{value}</h5>
  }
}
export default EditableText;