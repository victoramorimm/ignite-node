interface Course {
  name: string;
  duration?: number;
  educator: string;
}

class CreateCourseService {
  execute({ duration = 8, educator, name }: Course) {
    console.log(`Nome: ${name}; Duração: ${duration}; Professor: ${educator}`);
  }
}

export default CreateCourseService;
