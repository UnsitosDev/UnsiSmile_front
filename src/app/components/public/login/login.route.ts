import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: ()=>
            import('@mean/public').then(
                (m)=> m.LoginComponent
            ),
    },
] as Routes