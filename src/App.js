import React, {useEffect, useState} from 'react';
import './App.scss';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _ from "lodash";
import {v4 as uuid} from "uuid";

const LOCAL_STORAGE_KEY = 'todo_key';
function App() {
  const [text, setText] = useState('');
  const [group, setGroup] = useState('');
  const [state, setState] = useState({
    "todo": {
      title: "Todo",
      items: []
    },
  })

  useEffect(()=>{
    const storedState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if(storedState) {
      setState(storedState);
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  },[state]);

  const handleDragEng = ({destination, source}) =>{
    if(!destination) {
      return 
    }
    if(destination.index === source.index && destination.droppableId === source.droppableId){
      return 
    }
    const itemcopy = {...state[source.droppableId].items[source.index]}
    setState(prev=>{
      prev = {...prev}
      prev[source.droppableId].items.splice(source.index, 1)
      prev[destination.droppableId].items.splice(destination.index,0,itemcopy)
      return prev;
    })

  }
  const addItem = () => {
    if(!state){
      const newState = {
        "todo":{
          title:"Todo",
          items:[
            {
              id: uuid(),
              name: text
            }
          ]
        }
      }
      setState(newState);
    }else{
      setState(prev => {
        return {
          ...prev,
          todo: {
            title: "Todo",
            items: [
              {
                id: uuid(),
                name: text
              },
              ...prev.todo.items
            ]
          }
        }
      })
    }

    setText("")
  }

  const addGroup = () =>{
    if (group in state){
      return;
    }
    setState(prev => {
      return {
        ...prev,
         [group]: {
          title: group,
          items: []
        }
      }
    })
  }

  const deleteGroup = (userkey) =>{
    let newState = Object.assign({}, state);
    delete newState[userkey]
    setState(newState)
  }
  const deleteItem = ({key, index}) =>{
    let newState = Object.assign({}, state);
    const items = newState[key].items.splice(index,1);
    setState(newState)
  }

  return (
    <div className="App">
      <div>
        <label>Add Note</label>
        <input type="text" value={text} onChange={(e)=>setText(e.target.value) }/>
        <button onClick={addItem}>Add</button>
      </div>
      <div>
        <label>Add Group</label>
        <input type="text" value={group} onChange={(e)=>setGroup(e.target.value) }/>
        <button onClick={addGroup}>Add</button>
      </div>
      <DragDropContext onDragEnd={handleDragEng}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"}>
              {key!=="todo" ?
              (<div onClick={()=>deleteGroup(key)}
                  className="close-group">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
              </div>):
              <></>
              }
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided) => {
                  return(
                    <div ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={"droppable-col"}>
                      {data.items.map((el, index)=>{
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided)=>{
                              return (
                                <div className='item' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <div>
                                    <div onClick={(e)=>deleteItem({key: key, index: index})}
                                        className="close">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    {el.name}
                                  </div>
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
