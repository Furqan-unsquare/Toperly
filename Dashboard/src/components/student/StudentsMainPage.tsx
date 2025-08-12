import React from 'react'
import CoursesCatalog from '../CoursesCatalog'
import RecommendedCourses from './RecommendedCourses'
import TopPick from './TopPick'
import Footer from './Footer'
import TopRatedCourses from './TopRatedCourses'
import HeroSection from './HeroSection'

const StudentsMainPage = () => {
  return (
    <div>
      <HeroSection/>
      <RecommendedCourses/>
      <TopPick/>
      <TopRatedCourses/>
    </div>
  )
}

export default StudentsMainPage