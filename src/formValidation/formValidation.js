import * as Yup from 'yup'


/////////////  Auth  ////////////////
export const LoginValidation = Yup.object({
    email: Yup.string().email().required("Email is required").matches(/^[\w.%+-]+@gmail\.com$/, "Email must be a gmail address"),
    password: Yup.string().required("Password is required").min(10, "Password must be at least 10 characters").max(20, "Password must not exceed 20 characters"),
})

export const SignUpValidation = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required").matches(/^[\w.%+-]+@gmail\.com$/, "Email must be a gmail address"),
    password: Yup.string().required("Password is required").min(10, "Password must be at least 10 characters").max(20, "Password must not exceed 20 characters"),
})


/////////////////////////// Notes   /////////////////////////////

export const CreateNoteValidation = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().required("Priority is required"),
})


////////////////////// Password ////////////////////////////////

export const CreatePasswordValidation = Yup.object({
    title: Yup.string().required("Title is required"),
    password: Yup.string().required("Password is required"),
})


//////////// password verification //////////////

export const PasswordVerificationSchema = Yup.object({
    password: Yup.string().required('Password is required'),

})