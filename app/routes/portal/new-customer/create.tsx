// "use client";
import { CustomerForm } from './_components/new-customer.form'

const page = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <h2>Customer Form</h2>
        <CustomerForm  />
      </div>
  ) 
} 

export default page