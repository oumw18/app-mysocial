import { useParams } from "react-router";
import Layout from "../components/Layout";

export default function UserProfile() {
  const { authorId } = useParams();

  return <Layout>UserProfile {authorId} </Layout>;
}
