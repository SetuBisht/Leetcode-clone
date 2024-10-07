import React from 'react';
import { BsChevronUp } from 'react-icons/bs';



const UserConsole = ({ handleRun, handleSubmit, output }) => {
	return (
		<div className='flex h-fit min-h-[10vh] max-h-[35vh] bg-slate-700 bottom-0 w-full overflow-hidden'>
			<div className='mx-5 my-[10px] flex justify-between w-full'>
				<div className='mr-2 flex flex-1 items-center space-x-4'>
					<button className='px-3 py-1.5 font-medium inline-flex items-center transition-all bg-slate-500 text-sm hover:bg-slate-400 text-black rounded-lg pl-3 pr-2'>
						Console
						<div className='ml-1 flex items-center transition'>
							<BsChevronUp className='mx-1' color={'grey'} />
						</div>
					</button>
				</div>
				<div className='ml-auto flex items-center space-x-4'>
					<button
						className='px-3 py-1.5 text-sm font-medium inline-flex items-center transition-all bg-slate-500 hover:bg-slate-200 text-black rounded-lg'
						onClick={handleRun}
					>
						Run
					</button>
					<button
						className='px-3 py-1.5 text-sm font-medium inline-flex items-center transition-all text-white bg-dark-green-s hover:bg-green-300 rounded-lg'
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserConsole;
