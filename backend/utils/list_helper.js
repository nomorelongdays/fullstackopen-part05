const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
      return sum + blog.likes
  }

  return blogs.length === 0
      ? 0
      : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (accumulator, current) => {
      return accumulator.likes > current.likes ? accumulator : current
  }

  return blogs.length === 0
      ? {}
      : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  let _ = require('lodash')
  if (blogs.length === 0) return {}

  let result = _(blogs)
    .countBy('author')
    .entries().each()
      //.maxBy(_.last))
  //https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value/16097058#16097058
  //https://stackoverflow.com/questions/67366833/lodash-sorting-an-array-of-arrays
  // console.log('result presort:', result);
  result = result.sort((a,b)=>{return b[1]-a[1]})
  result =  _.head(result)
  result = ({
    'author': result[0],
    'blogs': result[1]
  })
  return result
}


const mostLikes = (blogs) => {
  let _ = require('lodash')
  if (blogs.length === 0) return {}
  const authorLikes = _(blogs)
      .groupBy('author')
      .map((blogs, author) => ({
          author,
          likes: _.sumBy(blogs, 'likes')
      }))
      .value()
      // console.log('authorLikes :', authorLikes);
  const authorWithMostLikes = _.maxBy(authorLikes, 'likes')
  //console.log(authorWithMostLikes)
  return (authorWithMostLikes)
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}