import React, { useState } from "react";
import "./App.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  getMyStoreState,
  handleDragEndStore,
} from "./features/todos/todoSlice";

function App() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const state = useSelector(getMyStoreState);
  //console.log("myStoreState", state);

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
    dispatch(handleDragEndStore({ destination, source }));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (text) {
      dispatch(addTodo(text));

      setText("");
    } else {
      alert("Please Add a task First");
    }
  };

  return (
    <div className="App-wrapper">
      <div className="input-section">
        <form onSubmit={addItem}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write Your Task..."
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="App">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={"column"}>
                <div className="column-heading-section">
                  <h3>{data.title}</h3>
                </div>
                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                //console.log(snapshot);
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {el.name}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
