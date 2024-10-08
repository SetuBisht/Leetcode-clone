import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Header/playgroundNavbar'
import Split from 'react-split';
import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import UserConsole from '@/components/Workspace/Playground/console/console';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';



const Ede = ({ user, problems, setSuccess }) => {

  const params = useParams();
  
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [clickedProblemsId, setClickedProblemId] = useState();
  const [clickedProblems, setClickedProblems] = useState();
  const [userCode, setUserCode] = useState();
  const [output, setOutput] = useState<(null);

  useEffect(() => {
    if (problems) {
      problems.forEach((problem, index) => {
        if (problem.id === params.id) {
          setClickedProblems(problem);
          setClickedProblemId(problem._id);
        }
      })
    }
  }, [problems])

  useEffect(() => {
    const code = localStorage.getItem(`code -${clickedProblems?.id}`);
    if (code === '""' || code === null) {
      setUserCode(clickedProblems?.starterCode)
    } else {
      setUserCode(JSON.parse(code))
    }
  }, [clickedProblems?.id])
  
  const handleCodeChange = (value) => {
    setUserCode(value);
  }

  const handleRun = async() => {
    try {
      localStorage.setItem(`code -${clickedProblems?.id}`, JSON.stringify(userCode));
      const res= await axios.post("../../../api/languages/python/run", {
        code : JSON.parse(JSON.stringify(userCode)),
      });

      if (res.data.success === true) {
        setOutput(`Output :  ${res.data.data}`);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "light"
        });
      } else {
        setOutput(`Error: ${res.data.error}`);
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark"
        });
      }

    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  }

  const handleSubmit = async () => {
    try {
      const ids = user?.problemList.map((prob) => prob?._id);
      const foundIndex = ids.indexOf(clickedProblemsId);
      
      const res = await axios.post("../../../api/languages/python/submit", {
        user : user,
        index: foundIndex,
        code : JSON.parse(JSON.stringify(userCode)),
        problem: clickedProblems
      });

      if (res.data.success === true) {
        setSuccess(true);
        setOutput(`Output :  ${res.data.data}`);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "light"
        });

      } else {
        setOutput(`Error: ${res.data.error}`);
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark"
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg-slate-700'>
      <Navbar />
      <Split className="h-[100vh]" direction="vertical" sizes={[60, 40]} minSize={150}>
        <div className='w-full h-[60%] overflow-auto bg-zinc-900'>
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={handleCodeChange}
            extensions={[python()]}
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className='w-full h-[40%] px-5 overflow-auto'>
          <div className='flex h-10 items-center space-x-6'>
            <div className='relative flex h-full flex-col justify-center cursor-pointer'>
              <div className='text-sm font-medium leading-5 text-white'>Testcases</div>
              <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
            </div>
          </div>
          <div className='flex'>
            {clickedProblems?.examples.map((example, index) => (
              <div
                className='mr-2 items-start mt-2'
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className='flex flex-wrap items-center gap-y-4'>
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-slate-800 hover:bg-slate-500 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap text-white`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='font-semibold my-4'>
            <p className='text-sm font-medium mt-4 text-white'>Input:</p>
            <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-gray-600 border-transparent text-white mt-2'>
              {clickedProblems?.examples[activeTestCaseId].inputText}
            </div>
            <p className='text-sm font-medium mt-4 text-white'>Output:</p>
            <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-gray-600 border-transparent text-white mt-2'>
              {clickedProblems?.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <div className='flex justify-center items-center bg-slate-700'>
        <UserConsole handleRun={handleRun} handleSubmit={handleSubmit} output={output} />
      </div>
      {output && (
        <div className='flex justify-center items-center text-white'>
          <div className='w-[95%] bg-[hsla(0,0%,100%,0.1)] text-[rgba(239,241,246,0.75)] text-[0.98rem] leading-5 whitespace-pre-wrap my-4 p-4 rounded-lg'>
            {output}
          </div>
        </div>
      )}
    </div>
  )
}

export default Ede;
