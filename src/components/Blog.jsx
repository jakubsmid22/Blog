import { format } from 'date-fns';

const Blog = ({ blog, openModal }) => {
  const img = "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";
  const formattedDate = blog.createdAt
    ? format(blog.createdAt.toDate(), 'MMMM dd, yyyy')
    : '';

  return (
    <article className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] relative h-[450px]">
      {img && <img className='w-full h-[200px] object-cover' src={blog.img || img} alt="" />}
      <div className="p-2 flex flex-col h-[250px] justify-between">
        <h1 className="font-bold text-xl h-[150px]">{blog.title}</h1>
        <p className="text-[#0000008a]">{blog.author} | {formattedDate}</p>
        
        <button onClick={() => openModal(blog)} className="bg-black text-white py-2 px-5 rounded-md">Read more</button>
      </div>
    </article>
  );
};

export default Blog;
