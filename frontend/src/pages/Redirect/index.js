import React, {useEffect} from "react";

export default (props) => {
  const searchQuery = props.location.search;

  const parsedParams = new URLSearchParams(searchQuery);

  const url = parsedParams.get("url")

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.replace(url);
    }, 2000);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div>
      <h1>Please wait</h1>
      <p>Click <a href={url}>here</a> if you are not automatically redirected</p>
    </div>
  );
}
