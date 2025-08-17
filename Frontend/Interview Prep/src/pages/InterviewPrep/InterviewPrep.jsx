import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {AnimatePresence,motion} from 'framer-motion';
import {LuCircleAlert,LuListCollapse} from "react-icons/lu";
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import {toast} from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';


const InterviewPrep = () => {
  const {sessionId} = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // fetch session data by sessionId
  const fetchSessionDetailsById=async () => {
      try{
        const response=await axiosInstance.get(
          API_PATHS.SESSION.GET_ONE(sessionId)
        );
        if(response.data && response.data.session){
          setSessionData(response.data.session);
        }
      } catch(error) {
        console.error("Error:", error);
      }
  };

  // generate concept explanation
  const generateConceptExplanation = async (question) => {
    try{
      setErrorMsg("");
      setExplanation(null)
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);
      const response=await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );
      if(response.data){
        setExplanation(response.data.data);
      }
    }catch(error){
      setExplanation(null)
      setErrorMsg("Failed to generate explanation,Try again Later");
      console.error("Error:",error);
    }finally{
      setIsLoading(false);
    }
  };

  // Pin Question
  const toogleQuestionPnStatus= async (questionId) => {
      try{
        const response=await axiosInstance.post(
          API_PATHS.QUESTION.PIN(questionId)
        );
        console.log(response);
        if(response.data && response.data.question){
          // toast.success('Question Pinned Successfully')
          fetchSessionDetailsById();
        }
      }catch(error){
        console.error("Error:",error);
      }
  };

  // Add More Questions to a session
  const uploadMoreQuestions = async () => {};

  useEffect(() => {
    if(sessionId){
      fetchSessionDetailsById();
    }
    return () => {};
  },[]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />
      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div className={`col-span-12 ${openLearnMoreDrawer?"md:col-span-7":"md:col-span-8"}`}>
            <AnimatePresence>
              {sessionData?.questions?.map((data,index)=>{
                return(
                  <motion.div
                  key={data._id || index}
                  initial={{opacity:0,y:-20}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,scale:0.95}}
                  transition={{
                    duration:0.4,
                    type:"spring",
                    stiffness:100,
                    delay:index*0.1,
                    damping:15,
                  }}
                  layout // this is the key prop that animates position changes
                  layoutId={`question-${data._id || index}`} // helps farmer track specific items
                  >
                    <>
                    <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={()=>
                          generateConceptExplanation(data.question)
                        }
                        isPinned={data?.isPinned}
                        onTogglePin={()=>toogleQuestionPnStatus(data._id)}
                      />
                    </>
                  </motion.div>
                ); 
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLearnMoreDrawer}
            onClose={()=> setOpenLearnMoreDrawer(false)}
            title={!isLoading && explanation?.title}
            >
              {errorMsg && (
                <p className="">
                  <LuCircleAlert className=""/>{errorMsg}
                </p>
              )}
              {isLoading && <SkeletonLoader/>}
              {!isLoading && explanation && (
                <AIResponsePreview content={explanation?.explanation}/>
              )}
            </Drawer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep