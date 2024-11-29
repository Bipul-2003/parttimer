import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// Mock function to fetch subscription data
const fetchSubscriptionData = () => {
  return {
    plan: "Seller",
    status: "Active",
    renewalDate: "2023-12-31",
    price: "$10/month",
  }
}

export default function OrgSettingsPage() {
  const [orgName, setOrgName] = useState("My Organization")
  const [orgDescription, setOrgDescription] = useState("This is my organization's description.")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const subscriptionData = fetchSubscriptionData()

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Organization Updated",
      description: "Your organization details have been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Organization Details</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your organization's information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveOrganization}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Description</Label>
                  <Textarea
                    id="orgDescription"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Describe your organization"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>View and manage your current subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Current Plan</Label>
                  <p>{subscriptionData.plan}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <p>{subscriptionData.status}</p>
                </div>
                <div>
                  <Label className="font-medium">Renewal Date</Label>
                  <p>{subscriptionData.renewalDate}</p>
                </div>
                <div>
                  <Label className="font-medium">Price</Label>
                  <p>{subscriptionData.price}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              {/* <Button variant="outline" className="w-full sm:w-auto">Change Plan</Button> */}
              <Button variant="destructive" className="w-full sm:w-auto">Cancel Subscription</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}







// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Loader2, Save } from 'lucide-react'
// import { useToast } from "@/hooks/use-toast"
// import { useAuth } from "@/context/AuthContext"
// import { dashboardAPI } from "@/api/dashboard"

// export default function OrgSettingsPage() {
//   const [orgName, setOrgName] = useState("")
//   const [orgDescription, setOrgDescription] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
//   const { user } = useAuth()
//   const [subscriptionData, setSubscriptionData] = useState(null)

//   useEffect(() => {
//     const fetchOrgData = async () => {
//       if (!user?.organization) return;

//       try {
//         const orgData = await dashboardAPI.getOrganizationDetails(user.organization.id.toString());
//         setOrgName(orgData.name);
//         setOrgDescription(orgData.description);

//         const subData = await dashboardAPI.getSubscriptionData(user.organization.id.toString());
//         setSubscriptionData(subData);
//       } catch (error) {
//         console.error("Error fetching organization data:", error);
//       }
//     };

//     fetchOrgData();
//   }, [user?.organization]);

//   const handleSaveOrganization = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user?.organization) return;

//     setIsLoading(true)
//     try {
//       await dashboardAPI.updateOrganizationDetails(user.organization.id.toString(), {
//         name: orgName,
//         description: orgDescription,
//       });
//       toast({
//         title: "Organization Updated",
//         description: "Your organization details have been saved successfully.",
//       })
//     } catch (error) {
//       console.error("Error updating organization details:", error);
//       toast({
//         title: "Update Failed",
//         description: "There was an error updating your organization details.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!user?.organization) {
//     return <div>You are not associated with any organization.</div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
//       <Tabs defaultValue="organization" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="organization">Organization Details</TabsTrigger>
//           <TabsTrigger value="subscription">Subscription Management</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="organization">
//           <Card>
//             <CardHeader>
//               <CardTitle>Organization Details</CardTitle>
//               <CardDescription>Update your organization's information</CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSaveOrganization}>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="orgName">Organization Name</Label>
//                   <Input
//                     id="orgName"
//                     value={orgName}
//                     onChange={(e) => setOrgName(e.target.value)}
//                     placeholder="Enter organization name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="orgDescription">Description</Label>
//                   <Textarea
//                     id="orgDescription"
//                     value={orgDescription}
//                     onChange={(e) => setOrgDescription(e.target.value)}
//                     placeholder="Describe your organization"
//                     rows={4}
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>

//         <TabsContent value="subscription">
//           <Card>
//             <CardHeader>
//               <CardTitle>Subscription Management</CardTitle>
//               <CardDescription>View and manage your current subscription</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {subscriptionData && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label className="font-medium">Current Plan</Label>
//                     <p>{subscriptionData.plan}</p>
//                   </div>
//                   <div>
//                     <Label className="font-medium">Status</Label>
//                     <p>{subscriptionData.status}</p>
//                   </div>
//                   <div>
//                     <Label className="font-medium">Renewal Date</Label>
//                     <p>{subscriptionData.renewalDate}</p>
//                   </div>
//                   <div>
//                     <Label className="font-medium">Price</Label>
//                     <p>{subscriptionData.price}</p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
//               <Button variant="destructive" className="w-full sm:w-auto">Cancel Subscription</Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


