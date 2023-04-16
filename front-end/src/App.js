import './App.css';
import { useQuery, useMutation } from "@apollo/client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resolver, FETCH_TODO, CREATE_TODO, DELETE_TODO, UPDATE_TODO } from "./App.tsx";

function App() {
  const { data, loading, error, refetch } = useQuery(FETCH_TODO);
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [
      { query: FETCH_TODO }
    ]
  });
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [
      { query: FETCH_TODO }
    ]
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [
      { query: FETCH_TODO }
    ]
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ resolver });

  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorProcess, setErrorProcess] = useState('');

  const onDelete = async (id) => {
    await deleteTodo({ variables: { deleteId: Number(id) } });
  };

  const updateItem = (id) => {
    const item = data.todos.find((i) => i.id === id);
    setValue("id", item.id);
    setValue("description", item.description);
    setValue("isFinished", item.isFinished);
    setIsUpdating(true);
    setShowForm(true);
    return true;
  };

  const onSubmit = async (values) => {
    let result = null;
    if (isUpdating) {
      result = await updateTodo({ variables: { editId: Number(values.id), editDescription2: values.description, isFinished: values.isFinished === 'true' ? true : false } });
    } else {
      result = await createTodo({ variables: { createId: Number(values.id), description: values.description } });
    }
    if (!isUpdating && result && result.data.create.error) {
      setErrorProcess(result.data.create.error);
      return;
    }
    if (isUpdating && result && result.data.edit.error) {
      setErrorProcess(result.data.edit.error);
      return;
    }
    setErrorProcess('');
    setShowForm(false);
    return true;
  };



  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>

  return (
    <div className="main">
      <h1>List Todo</h1>
      <div>
        {data.todos.length && <div className='table'>
          <div className='item-id'>Id</div>
          <div className='item-des'>Description</div>
          <div className='item-finish'>is Finished</div>
          <div className='item-action'>Action</div>
        </div>}
        {data.todos.length && data.todos.map((item) => (
          <React.Fragment key={item.id}>
            <div className='table'>
              <div className='item-id'>{item.id}</div>
              <div className='item-des'>{item.description}</div>
              <div className='item-finish'>{item.isFinished ? "True" : "False"}</div>
              <div className='item-action'>
                <input type="submit" value="Delete" onClick={() => onDelete(item.id)} />
                <input type="submit" value="Update" onClick={() => updateItem(item.id)} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <br />
      <div>
        {showForm && <div>
          <h1>{!isUpdating ? "Create new todo" : "Update a todo"}</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='table'>
              <input className='item-id' {...register('id')} id='idItem' type="text" />
              <input className='item-des'  {...register('description')} id='description' type="text" />
              {isUpdating && <input className='item-finish'  {...register('isFinished')} id='isFinished' type="checkbox" />}
              <input type="submit" value="Save" />
              <input type="button" value="Cancel" onClick={() => { setShowForm(false); setIsUpdating(false) }} />
            </div>
          </form></div>}
        {errors && errors.id && <div>{errors.id.message}</div>}
        {errors && errors.description && <div>{errors.description.message}</div>}
        {errorProcess && <div>{errorProcess}</div>}
        {!showForm && <input type="submit" value="Create new" onClick={() => { setShowForm(true) }} />}
      </div>
    </div>
  );
}

export default App;
