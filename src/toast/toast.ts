// interface sweetAlertProps {
//     title: string;
//     text: string;
//     icon: 'success' | 'error' | 'warning' | 'info' | 'question';
//     showCancelButton?: boolean;
//     confirmButtonText?: string;
//     cancelButtonText?: string;
// }

// type SweetAlertResult = {
//     title: string;
//     text: string;
//     icon: 'success' | 'error' | 'warning' | 'info' | 'question';
//     showCancelButton?: boolean;
//     confirmButtonText?: string;
//     cancelButtonText?: string;
// };

// export const ConfirmationAlertAsync = async (sweetAlertProps: SweetAlertResult) => {
//     return await Swal.fire({
//         title: sweetAlertProps.title,
//         text: sweetAlertProps.text,
//         icon: sweetAlertProps.icon,
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: sweetAlertProps.confirmButtonText ?? "Yes, i'm sure",
//     });
// }

// export const Alert = (sweetAlertProps: SweetAlertResult) => {
//     Swal.fire({
//         title: sweetAlertProps.title,
//         text: sweetAlertProps.text,
//         icon: sweetAlertProps.icon,
//     });

// }

// const success = () => {

// }
