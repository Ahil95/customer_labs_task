import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Button,
  IconButton,
} from "@mui/material";
import { SegementOptions } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Popup = ({ showPopup, setShowPopup }) => {
  const [segmentName, setSegmentName] = useState();
  const [segmentOption, setSegmentOption] = useState("");
  const [schema, setSchema] = useState([]);

  console.log(SegementOptions);
  const handleClose = () => {
    setShowPopup(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const selectedValue = schema?.map((item) => schema?.value);
  const currentOptions = SegementOptions?.filter(
    (item) => !selectedValue?.includes(item?.Value)
  );

  const getCurrentOptions = (currentValue) => {
    const otherSelected = schema
      ?.filter((item) => item?.value !== currentValue)
      ?.map((item) => item?.value);

    return SegementOptions?.filter(
      (item) => !otherSelected.includes(item?.Value)
    );
  };

  const handleAddSchema = () => {
    if (!segmentOption) return;
    console.log(schema);
    const selectedSchema = SegementOptions.find(
      (option) => option.Value === segmentOption
    );
    if (selectedSchema) {
      setSchema([
        ...schema,
        {
          id: uuidv4(),
          value: selectedSchema.Value,
          label: selectedSchema.Label,
        },
      ]);
    }
    setSegmentOption("");
  };

  const handleSchemaChange = (id, newValue) => {
    const selectedSchema = SegementOptions.find(
      (option) => option.Value === newValue
    );

    if (selectedSchema) {
      const updatedSchema = schema.map((item) =>
        item.id === id
          ? { ...item, value: newValue, label: selectedSchema.Label }
          : item
      );
      setSchema(updatedSchema);
    }
  };

  const handleRemoveSchema = (id) => {
    const updatedSchema = schema?.filter((item) => item?.id !== id);

    setSchema(updatedSchema);
  };
  const handleSave = () => {
    console.log(schema);

    const data = {
      segment_name: segmentName,
      schema: schema?.map((item) => ({ [item.value]: item?.label })),
    };
    console.log(data);
    axios
      .post(`https://webhook.site/01275c77-86ca-4a47-a2b6-9b39923be44a`, {
        data,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <Modal
      open={showPopup}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <p>Enter the Name of the Segment</p>
        <TextField
          id="outlined-required"
          label="Name of the Segment"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          fullWidth
        />
        <p>
          To save your segment, you need to add the elements to build the query
        </p>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Add Schema to the segment
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={segmentOption}
            label="Add Schema to the segment"
            onChange={(e) => setSegmentOption(e?.target?.value)}
          >
            {currentOptions?.map((item) => (
              <MenuItem value={item?.Value}>{item?.Label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Link
            component="button"
            onClick={handleAddSchema}
            disabled={!segmentOption}
          >
            + Add New Schema
          </Link>
        </Box>
        <Box sx={{ mt: 2 }}>
          {schema?.length > 0 &&
            schema?.map((schema, index) => (
              <Box
                key={schema?.id}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <FormControl fullWidth>
                  <InputLabel id={`schema-select-label-${schema.id}`}>
                    Add Schema to the segment
                  </InputLabel>
                  <Select
                    labelId={`schema-select-label-${schema.id}`}
                    id={`schema-select-${schema.id}`}
                    value={schema.value}
                    label="Add Schema to the segment"
                    onChange={(e) =>
                      handleSchemaChange(schema.id, e.target.value)
                    }
                  >
                    {getCurrentOptions(schema.value).map((item) => (
                      <MenuItem key={item.Value} value={item.Value}>
                        {item.Label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleRemoveSchema(schema.id)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleSave}>
            Save the Segment
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Popup;
