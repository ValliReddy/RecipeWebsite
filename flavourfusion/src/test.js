import React, { useState } from 'react';

const Test = ({lan}) => {
  console.log("Name prop in Test component:", lan);
  const [data, setData] = useState({
    username: '',
  });

  const onChange = e => {
    setData({
      ...data,
      username: e.target.value,
    });
  };

  return (
    <div>
      <h1>Hello world {data.username}</h1>
      <h2>{lan}</h2>
      <input
        type="text"
        name="username"
        value={data.username}
        onChange={onChange}
        placeholder="Enter username"
      />
    </div>
  );
};

export default Test;
