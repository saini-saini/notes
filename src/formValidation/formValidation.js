import * as Yup from 'yup'


/////////////  Auth  ////////////////
export const LoginValidation = Yup.object({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required").min(10, "Password must be at least 10 characters").max(20, "Password must not exceed 20 characters"),
})

export const SignUpValidation = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required").min(10, "Password must be at least 10 characters").max(20, "Password must not exceed 20 characters"),
})


/////////////////////////// Notes   /////////////////////////////

export const CreateNoteValidation = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().required("Priority is required").oneOf(["low", "medium", "high"]),
})