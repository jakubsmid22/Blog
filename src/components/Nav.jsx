const Nav = () => {
  return (
    <nav>
      <ul className="flex gap-5">
        <li>
          <a href="#postBlog">Post Blog</a>
        </li>
        <li>
          <a href="#recentBlogs">Recent Blogs</a>
        </li>
        <li>
          <a href="#userBlogs">Your Blogs</a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
